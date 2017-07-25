// @flow
import retry from '../index';

test('can repeat', () => {
  const myMock = jest.fn();
  myMock.mockReturnValue(Promise.resolve(false));
  expect.assertions(1);
  // return user.getUserName(4).then(data => expect(data).toEqual('Mark'));
  return retry(myMock, 5)
  .then((res) => {
    expect(res).toBeFalsy();
  });
    // .mockReturnValueOnce('x')
    // .mockReturnValue(true);
  // // The mock function is called twice
  // expect(mockCallback.mock.calls.length).toBe(2);
  // // The first argument of the first call to the function was 0
  // expect(mockCallback.mock.calls[0][0]).toBe(0);

  // // The first argument of the second call to the function was 1
  // expect(mockCallback.mock.calls[1][0]).toBe(1);

});
