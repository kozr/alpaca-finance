const logError = (error: Error, alert : boolean = false) => {
  console.error(error);
  if (alert) {
    window.alert(error.message);
  }
}

export { logError };