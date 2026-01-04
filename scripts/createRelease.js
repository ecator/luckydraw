// 创建发布版本zip
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 获取版本号
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const exeFile = path.join(__dirname, '..', 'src-tauri', 'target', 'release', 'LuckyDraw.exe');
if (!fs.existsSync(exeFile)) {
    console.error("请先运行: pnpm tauri build")
    process.exit(1);
}

const envFile = path.join(__dirname, '..', '.env.example');

const releasePath = path.join(__dirname, '..', 'release');
fs.existsSync(releasePath) || fs.mkdirSync(releasePath);

const zipPath = path.join(releasePath, `LuckyDraw-v${version}.zip`);
fs.existsSync(zipPath) && fs.unlinkSync(zipPath);

const avatarPath = path.join(releasePath, 'avatar');
fs.existsSync(avatarPath) || fs.mkdirSync(avatarPath);

const audioPath = path.join(releasePath, 'audio');
fs.existsSync(audioPath) || fs.mkdirSync(audioPath);

const imgPath = path.join(releasePath, 'img');
fs.existsSync(imgPath) || fs.mkdirSync(imgPath);

fs.copyFileSync(exeFile, path.join(releasePath, 'LuckyDraw.exe'));

fs.copyFileSync(envFile, path.join(releasePath, '.env'));

// 打包
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });
output.on('close', () => {
    console.log(`\n🎉 发布版打包成功!`);
    console.log(`文件路径: ${zipPath}`);
    console.log(`总大小: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
});
archive.on('error', (err) => { throw err; });
archive.pipe(output);
// 将 release 目录下的内容全选入压缩包（排除 zip 本身）
archive.file(path.join(releasePath, 'LuckyDraw.exe'), { name: 'LuckyDraw.exe' });
archive.file(path.join(releasePath, '.env'), { name: '.env' });
archive.append(null, { name: 'avatar/' });
archive.directory(avatarPath, 'avatar');
archive.append(null, { name: 'audio/' });
archive.directory(audioPath, 'audio');
archive.append(null, { name: 'img/' });
archive.directory(imgPath, 'img');
archive.finalize();
