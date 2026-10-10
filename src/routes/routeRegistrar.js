class RouteRegistrar {
  constructor(router, middleware = []) {
    this.router = router;
    this.middleware = middleware;
  }

  register(method, path, handler) {
    const methodLower = method.toLowerCase();
    const middlewares = [...this.middleware];

    this.router[methodLower](path, ...middlewares, handler);
  }

  get(path, handler) {
    this.register('GET', path, handler);
  }

  post(path, handler) {
    this.register('POST', path, handler);
  }

  put(path, handler) {
    this.register('PUT', path, handler);
  }

  delete(path, handler) {
    this.register('DELETE', path, handler);
  }

  patch(path, handler) {
    this.register('PATCH', path, handler);
  }
}

module.exports = RouteRegistrar;
