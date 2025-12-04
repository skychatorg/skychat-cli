export enum SkyChatOption {
    Protocol = 'protocol',
    Host = 'host',
    User = 'user',
    Password = 'password',
    TokenDir = 'tokenDir',
}

export type SkyChatOptions = {
    [key in SkyChatOption]: string;
};
