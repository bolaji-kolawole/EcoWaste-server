
import User from "../model/User";



export const generateTitleFromMessage = (message: string): string => {
    if (!message?.trim()) return "";

    const words = message.trim().split(/\s+/);
    const firstTen = words.slice(0, 10).join(" ");

    return words.length > 10 ? `${firstTen}...` : firstTen;
};

export const generateCode = async (
    email: string
): Promise<{ userId: string; code: string }> => {

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error("User not found");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    return {
        userId: user.externalId,
        code,
    };
};