import _ from 'underscore';

/**
 * 月を前期(0)か後期(1)に変換する
 * 3～8月なら前期、それ以外なら後期になる
 *
 * @param {number} month
 * @return number
 */
export const toSeason = month => {
    month = (typeof month === 'number') ? month : ((new Date()).getMonth() + 1);
    return (3 <= month && month <= 8) ? 0 : 1;
};