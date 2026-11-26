import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_GA_MEASUREMENT_ID, resolveGaMeasurementId } from '../lib/analytics-config.ts';

test('GA4: only the Vercel Production deployment loads the measurement ID', () => {
  assert.equal(
    resolveGaMeasurementId({ vercelEnv: 'production', configuredId: undefined }),
    DEFAULT_GA_MEASUREMENT_ID,
  );
  assert.equal(
    resolveGaMeasurementId({ vercelEnv: 'production', configuredId: '' }),
    DEFAULT_GA_MEASUREMENT_ID,
  );
  assert.equal(
    resolveGaMeasurementId({ vercelEnv: 'production', configuredId: 'G-OVERRIDE' }),
    'G-OVERRIDE',
  );
});

test('GA4: local builds and Vercel Preview never load the production measurement ID', () => {
  for (const vercelEnv of [undefined, '', 'preview', 'development']) {
    assert.equal(
      resolveGaMeasurementId({ vercelEnv, configuredId: DEFAULT_GA_MEASUREMENT_ID }),
      undefined,
      String(vercelEnv),
    );
  }
});
