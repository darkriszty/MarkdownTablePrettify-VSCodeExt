export class InputReader {
    static subscribe(readDone): void {
        //TODO: read the "--check" argument
        if (process.stdin.isTTY) {
            readDone(process.argv[2] || "");
        } else {
            let data = "";
            process.stdin.setEncoding("utf-8");

            process.stdin.on("readable", function() {
                let chunk;
                while (chunk = process.stdin.read()) {
                    data += chunk;
                }
            });

            process.stdin.on("end", function () {
                data = data.replace(/\n$/, "");
                readDone(data);
            });
        }
    }
}
