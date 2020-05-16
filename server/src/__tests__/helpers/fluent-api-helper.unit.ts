/* eslint-disable @typescript-eslint/await-thenable */
import {expect, sinon} from '@loopback/testlab';
import {createFluentAPI} from './fluent-api-helper';

describe('createFluentAPI', () => {
  type User = {
    id: string,
    name: string
  }

  const userData: User = {
    id: '1',
    name: 'foo',
  };

  const spyBuilder = sinon.spy(async (data: User) => data);
  const userBuilder = createFluentAPI(spyBuilder, {
    withId(data, id: string) {
      return {...data, id};
    },
    withName(data, name: string) {
      return {...data, name};
    },
  });

  beforeEach(() => spyBuilder.resetHistory());

  it('works with await', async () => {
    const givenAUser = userBuilder(userData);
    const u1 = await givenAUser;

    expect(u1).to.deepEqual(u1);
  });

  it('works with then', async () => {
    const givenAUser = userBuilder(userData);
    const u1 = await givenAUser.then(v => v);

    expect(u1).to.deepEqual(u1);
  });

  it('creates objects with predefined data', async () => {
    const givenAUser = userBuilder(userData);

    await expect(givenAUser).to.eventually.deepEqual(userData);
  });

  it('creates objects without predefined data', async () => {
    const givenAUser = userBuilder().withId('1').withName('foo');

    await expect(givenAUser).to.eventually.deepEqual(userData);
  });

  it('resolves with the same instance if not modified', async () => {
    const givenAUser = userBuilder().withId('1');

    const u1 = await givenAUser;
    const u2 = await givenAUser;

    expect(u1).to.equal(u2);
    expect(spyBuilder.callCount).to.equal(1);
  });

  it('resolves with a different instance if a property is added', async () => {
    const givenAUser = userBuilder().withId('1');

    const u1 = await givenAUser;
    const u2 = await givenAUser.withName('foo');

    expect(u1).to.not.equal(u2);
    expect(spyBuilder.callCount).to.equal(2);
  });

  it('resolves with a different instance if a property is modified', async () => {
    const givenAUser = userBuilder().withId('1').withName('foo');

    const u1 = await givenAUser;
    const u2 = await givenAUser.withId('2');

    expect(u1).to.not.equal(u2);
    expect(spyBuilder.callCount).to.equal(2);
  });

  it('resolves with a different instance if reset', async () => {
    const spy = sinon.spy(async () => ({}));
    const builder = createFluentAPI(spy, {});
    const givenAThing = builder();

    const u1 = await givenAThing;
    givenAThing.reset();
    const u2 = await givenAThing;

    expect(u1).to.not.equal(u2);
    expect(spy.callCount).to.equal(2);
  });

  describe('error handling', () => {

    it('handles throws', async () => {
      const throwingBuilder = createFluentAPI<never, {}>(async () => {
        throw new Error('fail throw!');
      }, {});

      await expect(throwingBuilder()).to.be.rejectedWith('fail throw!');
    });

    it('handles rejections', async () => {
      const rejectingBuilder = createFluentAPI(async () => {
        return Promise.reject(new Error('fail reject!'));
      }, {});

      await expect(rejectingBuilder()).to.be.rejectedWith('fail reject!');
    });

    it('works in try/catch', async () => {
      const throwingBuilder = createFluentAPI<never, {}>(async () => {
        throw new Error('fail throw!');
      }, {});

      let e;
      try {
        await throwingBuilder();
      } catch (err) {
        e = err;
      }

      expect(e.message).to.equal('fail throw!');
    });

    it('persists error', async () => {
      let throwCount = 1;

      const throwingBuilder = createFluentAPI<never, {}>(async () => {
        throw new Error('fail throw! ' + throwCount++);
      }, {});

      const givenAnError = throwingBuilder();

      await expect(givenAnError).to.be.rejectedWith('fail throw! 1');
      await expect(givenAnError).to.be.rejectedWith('fail throw! 1');
    });

    it('rethrows in try/catch', async () => {
      let throwCount = 1;

      const throwingBuilder = createFluentAPI<never, {}>(async () => {
        throw new Error('fail throw! ' + throwCount++);
      }, {});

      const givenAnError = throwingBuilder();
      let e1, e2;
      try {
        await givenAnError;
      } catch (err) {
        e1 = err;
      }
      try {
        await givenAnError;
      } catch (err) {
        e2 = err;
      }

      expect(e1.message).to.equal('fail throw! 1');
      expect(e2.message).to.equal('fail throw! 1');
      expect(e2).to.equal(e2);
    });

    it('error can be reset', async () => {
      let throwCount = 1;

      const throwingBuilder = createFluentAPI<never, {}>(async () => {
        throw new Error('fail throw! ' + throwCount++);
      }, {});

      const givenAnError = throwingBuilder();

      await expect(givenAnError).to.be.rejectedWith('fail throw! 1');
      givenAnError.reset();
      await expect(givenAnError).to.be.rejectedWith('fail throw! 2');
    });

  });

});
