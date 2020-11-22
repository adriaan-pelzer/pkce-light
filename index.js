const crypto = require('crypto');

const getRandomChar = chars => chars.charAt(Math.floor(Math.random() * chars.length));

const getRandomPKCEChar = () => getRandomChar('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-.~');

const generateVerifier = (l = 128, a = '') => a.length < l
  ? generateVerifier(l, a + getRandomPKCEChar())
  : a;

const sha256Hash = string => crypto.createHash('sha256').update(string).digest('ascii');

const base64UrlEncode = string => Buffer.from(string).toString('base64')
  .replace(/\x2B/g, '-') // +
  .replace(/\x2F/g, '_') // /
  .replace(/\x3D/g, ''); // =

const calculateChallenge = code_verifier => base64UrlEncode(sha256Hash(code_verifier));

const verify = ({ code_challenge, code_verifier }) => calculateChallenge(code_verifier) === code_challenge;

const generate = (length = 128) => {
  if (length < 43 || length > 128) {
    throw new Error('verifier length has to be between 43 and 128 (inclusive) characters');
  }
  const code_verifier = generateVerifier(length);
  return { code_challenge: calculateChallenge(code_verifier), code_verifier };
};

module.exports = { generate, verify };

if (!module.parent) { //test
  const assert = require('assert');
  console.log(`o test verification of a self-generated pair`)
  assert(verify(generate()));
  console.log(`✓ success`);
  console.log(`o test default length of a self-generated code_verifier`)
  assert(generate().code_verifier.length === 128);
  console.log(`✓ success`);
  console.log(`o test specified length of a self-generated code_verifier`)
  assert(generate(43).code_verifier.length === 43);
  console.log(`✓ success`);
  [
    {
      code_verifier: 'ECT4tUCzbe60qQ5OxYK5FmPLYRcm~Zzf-NwMtsS95zA6SDjRSbR9.F0-DtPbF2yrS.VSF7i96FLtAWlv6C7pvKCaDOBBYbC_iGG~86LTagLWmVOd4wva3bN0TJF0QMR5',
      code_challenge: 'Jh0JXUcIIzgKG3hiKhIIOHYoHXULVFIJPTlKAT00NwM'
    },
    {
      code_verifier: 'oDdRQQhKp9DD6xqWyTfg4EYZEdkOHQIHhxELf0LMgtGC2c2JdXwFCVxTUHw4_p4vEd-DQ-8GauQIt30SufdlNaIHTK7~-gQRq1ZETFOr2Av-DoTy4eNgKRwV6-CPaga1',
      code_challenge: 'ZjhCcgdbIAtKYEZbdSIIG1JDXB55FhlMJTZHXUQtHHY'
    }
  ].forEach((pair, idx) => {
    console.log(`o testing pair ${idx} pre-generated with base64url`);
    assert(verify(pair))
    console.log(`✓ success`);
  });
  console.log(`o test length lower limit`)
  try {
    generate(10);
  } catch(error) {
    assert(error.message === 'verifier length has to be between 43 and 128 (inclusive) characters');
  }
  console.log(`✓ success`);
  console.log(`o test length upper limit`)
  try {
    generate(200);
  } catch(error) {
    assert(error.message === 'verifier length has to be between 43 and 128 (inclusive) characters');
  }
  console.log(`✓ success`);
}
