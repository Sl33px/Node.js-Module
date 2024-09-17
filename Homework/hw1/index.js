const path = require('node:path');
const fsPromises = require('node:fs/promises');

// create 5 dirs
// every dir should have 5 files
// read content of files and folders
// write check if it folder or file

const textArr = [
    "The sun rises in the east.",
    "Birds sing in the morning.",
    "The coffee was hot and fresh.",
    "She loves to read books.",
    "The cat sat on the mat.",
    "He enjoys playing guitar.",
    "The flowers bloomed beautifully.",
    "They went for a walk in the park.",
    "Rain pattered against the window.",
    "The dog barked at the mailman.",
    "He cooked a delicious meal.",
    "The stars twinkled in the night sky.",
    "She wrote in her journal every day.",
    "The wind blew through the trees.",
    "The lake was calm and serene.",
    "They watched a movie together.",
    "The child laughed with joy.",
    "The artist painted a beautiful landscape.",
    "The car drove down the quiet road.",
    "The ice cream melted quickly.",
    "The music played softly in the background.",
    "She baked cookies for her friends.",
    "The phone rang loudly.",
    "The plane flew high in the sky.",
    "He studied for his exams diligently."
];

const main = async () => {
    const baseFolder = path.join(__dirname, 'baseFolder');
    await fsPromises.mkdir(baseFolder, { recursive: true });

    let sentenceIndex = 0;

    for (let i = 0; i < 5; i++) {
        const pathToFolder = path.join(baseFolder, `folder${i + 1}`);
        await fsPromises.mkdir(pathToFolder, { recursive: true });

        for (let j = 0; j < 5; j++) {
            if (sentenceIndex < textArr.length) {
                const pathToFile = path.join(pathToFolder, `test${j + 1}.txt`);
                const content = textArr[sentenceIndex];
                await fsPromises.writeFile(pathToFile, content);
                sentenceIndex++;
            }
        }
    }

    const baseFolderContent = await fsPromises.readdir(baseFolder, { withFileTypes: true });

    for (let currentFile of baseFolderContent) {
        const currentFilePath = path.join(baseFolder, currentFile.name)
        if (currentFile.isDirectory()) {
            console.log(`${currentFile.name} is a folder.`);
            const folderContents = await fsPromises.readdir(currentFilePath, { withFileTypes: true });
            for (const file of folderContents) {
                console.log(`${file.name} is a file.`);
            }
        } else {
            console.log(`${currentFile.name} is a file.`);
        }
    }
};

void main();