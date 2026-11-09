// Legacy OAuth entry point retired: no OOB flow or automatic startup.
const {authenticate} = require('./horror/oauth');
if (require.main === module) authenticate().catch(() => { console.error('Use docs/HORROR_SETUP.md to configure Desktop OAuth.'); process.exitCode=1; });
module.exports = {authenticate};
