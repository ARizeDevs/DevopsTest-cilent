import { NextPage } from 'next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { MoralisProvider } from 'react-moralis';
import { RootStoreProvider } from 'store/RootStoreProvider';
import DefaultLayout, { ExcludedLayoutPaths } from '../layouts/DefaultLayout';
import '../styles/globals.css';

type Props = AppProps & {
    Component: NextPage;
};

function App({ Component, pageProps, router }: Props) {
    let Content = (
        <DefaultLayout>
            <Component {...pageProps} />
        </DefaultLayout>
    );

    if (ExcludedLayoutPaths.some((path: string) => router.pathname.startsWith(path))) {
        Content = <Component {...pageProps} />;
    }

    const initializeUserback = () => {
        window.Userback.init('36639|71263|cTICFSqBQKaTGVU0HvUWc2osa', {
            categories: 'Frontend,Backend,BlockChain,User Experience',
            on_load: () => {
                // console.log('widget is loaded');
            }
        });

        window.Userback.widget_settings = {
            language: 'en', // string: "en", "fr", "zh-CN"...etc
            style: 'text', // string: "text", "circle"
            position: 'e', // string: "e", "w", "se", "sw"
            trigger_type: 'page_load', // string: page_load, api, url_match
            device_type: 'desktop,tablet,phone', // string
            help_link: 'https://arize.io/contact-us/', // string
            help_title: 'Contact Us', // string
            help_message: 'Get in touch with us', // string
            // logo: '//example.com/logo.jpg', // string
            logo: '/logo-black.png', // string
            form_settings: {
                // General Feedback Form
                general: {
                    rating_type: 'emoji', // "star", "emoji", "heart", "thumb"
                    rating_help_message: 'How would you like to rate your experience?',
                    name_field: false,
                    name_field_mandatory: false,
                    email_field: true,
                    email_field_mandatory: true,
                    title_field: false,
                    title_field_mandatory: false,
                    comment_field: true,
                    comment_field_mandatory: false,
                    display_category: false,
                    display_feedback: true,
                    display_attachment: false,
                    display_assignee: false,
                    display_priority: false,
                    main_button_text: 'Feedback',
                    main_button_background_colour: '#ff8766',
                    main_button_text_colour: '#FFFFFF'
                },
                // Bug Form
                bug: {},
                // Feature Request Form
                feature_request: {}
            }
        };
    };

    return (
        <>
            <Script
                strategy="afterInteractive"
                src="https://static.userback.io/widget/v1.js"
                onLoad={initializeUserback}
            />
            <RootStoreProvider hydrationData={pageProps.hydrationData}>
                <ThemeProvider attribute="class">{Content}</ThemeProvider>
            </RootStoreProvider>
        </>
    );
}

export default App;
