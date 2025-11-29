export async function register() {
  // Only run on the server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { bootstrapApplication, BootstrapError } = await import('./lib/bootstrap');

    try {
      await bootstrapApplication();
    } catch (error) {
      if (error instanceof BootstrapError) {
        console.error(`\n${'='.repeat(60)}`);
        console.error('BOOTSTRAP ERROR');
        console.error('='.repeat(60));
        console.error(error.message);
        console.error('='.repeat(60) + '\n');
        process.exit(1);
      }
      throw error;
    }
  }
}
