// Удаление файла
import fs from 'fs';

export function clearCrashTime() {
    const filePath = 'crashTime.txt';
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
