import fs from 'fs';

export function readCrashTime() {
    const filePath = 'crashTime.txt';
    if (fs.existsSync(filePath)) {
        // Чтение и вывод времени падения
        const crashTime = fs.readFileSync(filePath, 'utf8');
        console.log(`Время падения сервера: ${crashTime}`);
    }
}
