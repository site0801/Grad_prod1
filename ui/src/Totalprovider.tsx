import * as React from 'react'

interface IUsername {
    UsernameState: string;
    setUsernameState?: any;
}

interface ILoginContext {
    LoginState: boolean;
    setLoginState?: any;
}

const initUsernameState: IUsername = {
    UsernameState: ''
};

const initLoginState: ILoginContext = {
    LoginState: false
};

// 複数の Context を作成する
export const UsernameContext = React.createContext(initUsernameState)
export const UsernameProvider = UsernameContext.Provider

export const LoginContext = React.createContext(initLoginState)
export const LoginProvider = LoginContext.Provider

interface IProps {
    children: React.ReactNode;
    // any other props that come into the component
}

// ラップされた子要素全てが、children に props に入ってくる
export const Provider = ({children}: IProps) => {
    const [UsernameState, setUsernameState] = React.useState<string>('');
    const [LoginState, setLoginState] = React.useState<boolean>(false);
    
    return (  
        <LoginContext.Provider value={{ LoginState, setLoginState }}>
            <UsernameContext.Provider value={{ UsernameState, setUsernameState }}>
                {children}
            </UsernameContext.Provider>
        </LoginContext.Provider>
    )
}