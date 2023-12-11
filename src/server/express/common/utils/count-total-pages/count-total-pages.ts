export const countTotalPages = (totalRows: number, pageSize: number): number => {
    return Math.ceil(totalRows / pageSize);
};
