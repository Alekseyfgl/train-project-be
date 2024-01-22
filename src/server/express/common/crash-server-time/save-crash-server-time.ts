import fs from 'fs';

export function saveCrashTime() {
    const crashTime = new Date().toISOString();
    fs.writeFileSync('crashTime.txt', crashTime);
}

process.on('exit', saveCrashTime);
process.on('SIGINT', () => {
    saveCrashTime();
    process.exit();
});
process.on('uncaughtException', (error) => {
    console.error(error);
    saveCrashTime();
    process.exit(1);
});
