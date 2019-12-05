import process = require("process");
import fs = require("fs");
import path = require("path");

const args = process.argv.slice(2);
const srcDir = args[0];
const filenameFilter = args[1];

if (!srcDir || !filenameFilter)
{
	printUsage();
	process.exit(1);
}

const groupBreaks = new Set<string>();

for (let fileName of walkDir(srcDir))
{
	const regex = new RegExp(/<group_field>([^<]*)<\/group_field>/g);
	const fileContents = fs.readFileSync(fileName, { encoding: "utf8" });
	
	let result: RegExpExecArray | null;

	while (result = regex.exec(fileContents))
	{
		if (!result[1].startsWith("="))
			continue;

		groupBreaks.add(result[1]);
	}
}

for (let groupBreak of groupBreaks)
	console.log(groupBreak)


function printUsage()
{
	console.log(`xml-inspect`);
	console.log(`Performs operations on XML files`);
	console.log(`Usage: node main.js [srcDir] [filenameFilter]`);
}


function walkDir(dir: string): string[]
{
    let results = [] as string[];
	for (let fileName of fs.readdirSync(dir))
	{
		const filePath = path.join(dir, fileName);
        const stat = fs.statSync(filePath);
		if (stat && stat.isDirectory())
		{ 
            results = results.concat(walkDir(filePath));
		}
		else
		{ 
			if (new RegExp(filenameFilter).test(fileName))
        		results.push(filePath);
        }
	}

    return results;
}