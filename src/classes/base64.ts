export class Base64Encoder {
    public toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const res = e.target?.result;
                if (typeof res == "string") {
                    resolve(res);
                } else {
                    reject("Invalid type");
                }
            };
            reader.readAsDataURL(file);
        });
    }
}

export const base64 = new Base64Encoder();
