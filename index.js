/**
 * @Author: wansong
 * @Date:   2017-07-25T17:36:05+08:00
 * @Email:  betterofsong@gmail.com
 */



// @flow
type OP = () => Promise<bool>;
type Handle = { cancel: () => void, canceled: () => bool };

export default (() => {
  function delay(t) {
    return new Promise(resolve => setTimeout(resolve, t));
  }

  function exec(op, ii, delayi, handle:Handle) {
    if (!ii) {
      return Promise.resolve(false);
    }
    if (handle.canceled()) {
      return Promise.resolve(false);
    }
    return Promise.resolve()
    .then(op)
    .then((res) => {
      if (res) {
        return true;
      }
      if (ii === 1) {
        return false;
      }
      return delayi(ii).then(() => {
        return exec(op, ii - 1, delayi, handle);
      });
    });
  }

  return (op: OP, max: number = 10): [Promise<bool>, Handle] => {
    if (!max) {
      throw new Error('fuck');
    }

    let canceled = false;
    const handle = {
      canceled: () => canceled,
      cancel: () => { canceled = true; },
    };

    const promise = exec(op, max, t => delay(max * 1000 + 1000 - t * 1000), handle);
    return [promise, handle];
  };
})();
