// Staging lock: no environment variable can enable publishing in this fork.
function assertPublishingDisabled() {
  throw new Error('Publishing locked pending real-media, OAuth/channel and private-upload validation. Use reviewed manual YouTube Studio handoff.');
}
function assertExternal(env = process.env) {
  if (env.ALLOW_EXTERNAL_REQUESTS !== 'true') throw new Error('External requests disabled');
}
function assertPaid(env = process.env) {
  assertExternal(env);
  if (env.ALLOW_PAID_APIS !== 'true') throw new Error('Paid APIs disabled');
}
module.exports = { assertPublishingDisabled, assertExternal, assertPaid };
