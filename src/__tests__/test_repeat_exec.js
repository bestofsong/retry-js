// @flow
import retry from '../index';

// test('can repeat', () => {
    // .mockReturnValueOnce('x')
    // .mockReturnValue(true);
  // // The mock function is called twice
  // expect(mockCallback.mock.calls.length).toBe(2);
  // // The first argument of the first call to the function was 0
  // expect(mockCallback.mock.calls[0][0]).toBe(0);

  // // The first argument of the second call to the function was 1
  // expect(mockCallback.mock.calls[1][0]).toBe(1);

// });
describe('retry tests', function () {
    const REPEAT_TIME = 5;
    var originalTimeout;

    beforeEach(function() {
      const TMP_INTERVAL = (REPEAT_TIME * (REPEAT_TIME - 1) / 2) * 1000 + 1000;
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = TMP_INTERVAL;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });


    it('can repeat', function() {
      const myMock = jest.fn();
      myMock.mockReturnValue(Promise.resolve(false));
      expect.assertions(2);
      // return user.getUserName(4).then(data => expect(data).toEqual('Mark'));
      return retry(myMock, REPEAT_TIME)[0]
        .then((res) => {
          expect(res).toBeFalsy();
          expect(myMock.mock.calls.length).toBe(REPEAT_TIME);
        });
    });

    it('can cancel', function() {
      const myMock = jest.fn();
      myMock.mockReturnValue(Promise.resolve(false));
      expect.assertions(2);
      // return user.getUserName(4).then(data => expect(data).toEqual('Mark'));
      const [promise, handle] = retry(myMock, REPEAT_TIME);
      setTimeout(() => handle.cancel(), 2000);
      return promise
        .then((res) => {
          expect(res).toBeFalsy();
          expect(myMock.mock.calls.length).toBeLessThan(REPEAT_TIME);
        });
    });

    it('can quit early', function() {
      const myMock = jest.fn();
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValue(Promise.resolve(true));
      expect.assertions(2);
      const [promise, handle] = retry(myMock, REPEAT_TIME);
      return promise
        .then((res) => {
          expect(res).toBeTruthy();
          expect(myMock.mock.calls.length).toBe(4);
        });
    });

    it('edge case max = 1', function() {
      const myMock = jest.fn();
      myMock.mockReturnValueOnce(Promise.resolve(false));
      expect.assertions(2);
      const [promise, handle] = retry(myMock, 1);
      return promise
        .then((res) => {
          expect(res).toBeFalsy();
          expect(myMock.mock.calls.length).toBe(1);
        });
    });

    it('edge case last try succeed', function() {
      const myMock = jest.fn();
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValueOnce(Promise.resolve(false));
      myMock.mockReturnValue(Promise.resolve(true));
      expect.assertions(2);
      const [promise, handle] = retry(myMock, REPEAT_TIME);
      return promise
        .then((res) => {
          expect(res).toBeTruthy();
          expect(myMock.mock.calls.length).toBe(REPEAT_TIME);
        });
    });
});
