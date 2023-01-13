export const handleAddZero = (number) => number >= 10 ? number : `0${number}`;

export const handleGetTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = handleAddZero(now.getMonth() + 1);
    const date = handleAddZero(now.getDate());
    return `${year}-${month}-${date}`;
}