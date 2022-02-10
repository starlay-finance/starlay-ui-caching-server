import { providers } from 'ethers';
import { fetchJson } from 'ethers/lib/utils';
import { AlreadyUsedNodeContext } from './models/already-used-node-context';
import { InternalStarlayProviderContext } from './models/internal-starlay-provider-context';
import { StarlayProviderContext } from './models/starlay-provider-context';

export class StarlayCustomProvider extends providers.StaticJsonRpcProvider {
  private _alreadyUsedNodes: AlreadyUsedNodeContext[] = [];
  private _mainNode: string | undefined;
  constructor(
    private _context: StarlayProviderContext | InternalStarlayProviderContext,
    private _generate: (context: InternalStarlayProviderContext) => StarlayCustomProvider
  ) {
    super({ url: _context.selectedNode, throttleSlotInterval: _context.maxTimout });

    // get the internal context so we dont cast everywhere but we have checks below
    // to make sure we map to the correct context aka `StarlayProviderContext | InternalStarlayProviderContext`
    const internalStarlayProviderContext = this.getInternalStarlayProviderContext();

    if (internalStarlayProviderContext.alreadyUsedNodes) {
      this._alreadyUsedNodes = internalStarlayProviderContext.alreadyUsedNodes;
    }

    if (!internalStarlayProviderContext.mainNode) {
      this._mainNode = this._context.selectedNode;
    } else {
      this._mainNode = internalStarlayProviderContext.mainNode;
    }

    if (!this._context.mainNodeReconnectionSettings) {
      // defaults
      this._context.mainNodeReconnectionSettings = [
        {
          reconnectAttempts: 5,
          // 5 seconds
          reconnectIntervalAttempts: 5000,
        },
        {
          reconnectAttempts: 10,
          // 10 seconds
          reconnectIntervalAttempts: 10000,
        },
        {
          reconnectAttempts: 20,
          // 30 seconds
          reconnectIntervalAttempts: 30000,
        },
        {
          reconnectAttempts: 30,
          // 2 minutes
          reconnectIntervalAttempts: 120000,
        },
        {
          reconnectAttempts: Infinity,
          // 5 minutes
          reconnectIntervalAttempts: 300000,
        },
      ];
    }
  }

  /**
   * Overwrite ethers send
   * @param method The method
   * @param params The params
   */
  public async send(method: string, params: Array<any>): Promise<any> {
    const request = {
      method,
      params,
      id: this._nextId++,
      jsonrpc: '2.0',
    };

    if (this.shouldSwitchBackToMainNode()) {
      return this.switchBackToMainNode(method, params);
    }

    try {
      return await fetchJson(this.connection, JSON.stringify(request), this.getResult);
    } catch (error) {
      // ethers put all this context in a string so annoyingly we have to
      // look at string text... if ethers change these messages it breaks us, so first
      // place to look if this breaks is ethers source code.
      if (error.message.includes('missing response') || error.message.includes('bad response')) {
        return this.switchToBackupNode(method, params, error);
      } else {
        throw error;
      }
    }
  }

  /**
   * Get the results
   * @param payload The paylod
   */
  private getResult(payload: {
    // tslint:disable-next-line: no-any
    error?: { code?: number; data?: any; message?: string };
    // tslint:disable-next-line: no-any
    result?: any;
  }): string {
    if (payload.error) {
      // tslint:disable-next-line: no-any
      const error: any = new Error(payload.error.message);
      error.code = payload.error.code;
      error.data = payload.error.data;
      throw error;
    }

    return payload.result;
  }

  /**
   * Get the new node if there is none it will throw
   * @param error The error
   */
  private getNewNode(error: any): string {
    this._alreadyUsedNodes.push({
      wasMainNode: this._mainNode === this._context.selectedNode,
      node: this._context.selectedNode,
    });
    const availableNodes = this._context.backupNodes.filter(
      (b) => !this._alreadyUsedNodes.find((a) => a.node === b)
    );
    if (availableNodes.length === 0) {
      throw error;
    }
    return availableNodes[Math.floor(Math.random() * availableNodes.length)];
  }

  /**
   * Switch the broken node to a backup node
   * @param error The error to throw in case we have no nodes left to use
   */
  private async switchToBackupNode(method: string, params: Array<any>, error: any): Promise<any> {
    const newSelectedNode = this.getNewNode(error);

    const provider = this._generate({
      selectedNode: newSelectedNode,
      backupNodes: this._context.backupNodes,
      alreadyUsedNodes: this._alreadyUsedNodes,
      mainNode: this._mainNode,
      mainNodeReconnectionContext:
        this._mainNode === this._context.selectedNode
          ? {
              reconnectAttempts: 1,
              lastAttempted: new Date().getTime(),
            }
          : undefined,
      mainNodeReconnectionSettings: this._context.mainNodeReconnectionSettings,
      maxTimout: this._context.maxTimout,
    });

    return provider.send(method, params);
  }

  /**
   * Switch the broken node to a backup node
   * @param error The error to throw in case we have no nodes left to use
   */
  private async switchBackToMainNode(method: string, params: Array<any>): Promise<any> {
    const newSelectedNode = this._mainNode;

    const context = this.getInternalStarlayProviderContext();
    if (context.mainNodeReconnectionContext) {
      context.mainNodeReconnectionContext.reconnectAttempts =
        context.mainNodeReconnectionContext.reconnectAttempts + 1;
      context.mainNodeReconnectionContext.lastAttempted = new Date().getTime();
    } else {
      context.mainNodeReconnectionContext = {
        reconnectAttempts: 1,
        lastAttempted: new Date().getTime(),
      };
    }

    const provider = this._generate({
      selectedNode: newSelectedNode,
      backupNodes: this._context.backupNodes,
      // move the alive node away from already used so it can be picked up again
      alreadyUsedNodes: this._alreadyUsedNodes.filter(
        (c) => c.node !== this._mainNode && c.node === this._context.selectedNode
      ),
      mainNode: this._mainNode,
      mainNodeReconnectionContext: context.mainNodeReconnectionContext,
      mainNodeReconnectionSettings: this._context.mainNodeReconnectionSettings,
      maxTimout: this._context.maxTimout,
    });

    return provider.send(method, params);
  }

  /**
   * Work out if it should switch back to the main node
   */
  private shouldSwitchBackToMainNode(): boolean {
    if (this._mainNode === this._context.selectedNode) {
      return false;
    }

    const context = this.getInternalStarlayProviderContext();
    if (!context.mainNodeReconnectionContext) {
      return false;
    }

    const timestamp = new Date().getTime();

    for (let i = 0; i < context.mainNodeReconnectionSettings.length; i++) {
      const reconnectionSetting = this._context.mainNodeReconnectionSettings![i];
      if (
        context.mainNodeReconnectionContext.reconnectAttempts <=
          reconnectionSetting.reconnectAttempts ||
        context.mainNodeReconnectionContext.reconnectAttempts === Infinity
      ) {
        return (
          timestamp - context.mainNodeReconnectionContext.lastAttempted >
          reconnectionSetting.reconnectIntervalAttempts
        );
      }
    }
  }

  /**
   * Get the internal starlay provider context
   */
  private getInternalStarlayProviderContext(): InternalStarlayProviderContext {
    return this._context as InternalStarlayProviderContext;
  }
}
