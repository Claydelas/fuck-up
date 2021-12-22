import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head />
        <body
          className='min-h-screen scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent
          text-dark bg-light scrollbar-thumb-dark
          dark:text-light dark:bg-dark dark:scrollbar-thumb-light transition-colors duration-500'
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
