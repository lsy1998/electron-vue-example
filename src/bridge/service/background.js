win.on("closed", () => {
  win = null;
}); // Windows创建完成后初始化context
new ApplicationContext(app, win).init();
