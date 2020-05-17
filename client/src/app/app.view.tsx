import React from 'react';

export const AppView = ({Shell}: PickInjected<typeof dependencies>) => {
  return (
    <div>learn react</div>
  );
};

const dependencies = [Injected.Shell] as const;
Object.assign(AppView, {[Symbol.for('ram.deps')]: dependencies});
