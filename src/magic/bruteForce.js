const runRecipe = require('./runRecipe');
const OperationConfig = require('./OperationConfig.json');

const { buffersEqual } = require('./utils');

const bruteForce = async (inputBuffer) => {
  const sample = new Uint8Array(inputBuffer).slice(0, 100);
  const results = [];

  // 1-byte XOR
  for (let i = 1; i < 256; i++) {
    results.push({
      data: sample.map((b) => b ^ i).buffer,
      conf: {
        op: 'XOR',
        args: [{ option: 'Hex', string: i.toString(16) }, 'Standard', false]
      }
    });
  }

  // Bit rotate
  for (let i = 1; i < 8; i++) {
    results.push({
      data: sample.map((b) => (b >> i) | ((b & (Math.pow(2, i) - 1)) << (8 - i))).buffer,
      conf: {
        op: 'Rotate right',
        args: [i, false]
      }
    });
  }

  // Character encodings
  const encodings = OperationConfig['Encode text'].args[0].value;

  /**
   * Test character encodings and add them if they change the data.
   */
  const testEnc = async (op) => {
    for (let i = 0; i < encodings.length; i++) {
      const conf = {
        op: op,
        args: [encodings[i]]
      };

      try {
        const data = await runRecipe([conf], sample.buffer);

        // Only add to the results if it changed the data
        if (!buffersEqual(data, sample.buffer)) {
          results.push({
            data: data,
            conf: conf
          });
        }
      } catch (err) {
        continue;
      }
    }
  };

  await testEnc('Encode text');
  await testEnc('Decode text');

  return results;
};

module.exports = bruteForce;
