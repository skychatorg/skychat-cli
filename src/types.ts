export enum SkyChatOption {
    Protocol = 'protocol',
    Host = 'host',
    User = 'user',
    Password = 'password',
}

export type SkyChatOptions = {
    [key in SkyChatOption]: string;
};
