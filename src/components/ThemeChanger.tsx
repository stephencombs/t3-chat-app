import { useTheme } from 'next-themes';
import { Button } from './ui/Button';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

const ThemeChanger = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            variant="outline"
            className="absolute right-2 top-2"
            onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
        >
            {theme === 'dark' ? <Moon /> : <Sun />}
        </Button>
    );
};

export default ThemeChanger;
