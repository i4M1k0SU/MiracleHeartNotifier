const isMentionToMe = (text: string, userId?: string): boolean => {
    // <>はエスケープされているのでこれで問題はない
    const pattern = `<@${userId || ''}(\|.+)?>`;
    const reg = new RegExp(pattern);
    return !!text.match(reg);
};

const isDirectMessageToMe = (channelId: string): boolean => {
    // @see https://stackoverflow.com/questions/41111227/how-can-a-slack-bot-detect-a-direct-message-vs-a-message-in-a-channel
    // Dから始まるチャンネルIDはDM
    return channelId.slice(0, 1) === 'D';
};

export {isMentionToMe, isDirectMessageToMe};
