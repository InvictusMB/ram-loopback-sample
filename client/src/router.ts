export function createRouter() {
  const routeConfig = {} as RouteMap;
  const index = {} as ComponentMap;
  return {
    routeConfig,
    register(components: ComponentMap) {
      const mappedRoutes = mapEntries(components, ([id, component]) => {
        validateRoute(index, component);
        return [component.route, id];
      });
      Object.assign(routeConfig, mappedRoutes);
      return this;
    },
  };
}

function validateRoute(index: ComponentMap, component: ComponentWithRoute) {
  const {route} = component;
  const normalized = normalize(route);
  if (!index[normalized]) {
    index[normalized] = component;
    return;
  }
  console.log(normalized);
  console.warn('Duplicated route found:', route, '\ncomponent1:', index[normalized], '\ncomponent2:', component);
}

function mapEntries<T, U extends keyof T, V>(o: T, fn: mapperFn<T, U, V>) {
  return Object.fromEntries(
    Object.entries(o)
      .map(fn),
  );
}

type mapperFn<T, U extends keyof T, V> = (pair: [string, T[U]]) => [U, V];

function normalize(route: string) {
  return route.replace(/:\w+/g, '{{0}}');
}

type RouteMap = {[componentId: string]: string};
type ComponentMap = {[route: string]: ComponentWithRoute};
type ComponentWithRoute = {route: string};
