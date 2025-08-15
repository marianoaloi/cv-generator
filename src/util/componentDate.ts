
export const convertDate = (start: string): React.ReactNode => {
    return new Date(start).toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
    });
}
