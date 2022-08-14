var hooked = false;

function HookAccountsChanged(callback) {
  if (hooked) {
    return;
  }

  hooked = true;

  window.ethereum.on("accountsChanged", callback);
  window.ethereum.on("chainChanged", callback);
}

export { HookAccountsChanged }
