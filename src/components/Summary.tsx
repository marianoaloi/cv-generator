import { classIdent, identParagraph } from '@/util/componentString';
import React from 'react';

interface SummaryProps {
  data: string;
  lang: string;
}

const Summary: React.FC<SummaryProps> = ({ data, lang }) => {
  return (
    <>

      <div className='text-justify' dangerouslySetInnerHTML={{ __html: identParagraph(data) }} />
      <p className={classIdent}>
      {lang === "it" ?


        <>
          Grazie ai progressi nella capacità dell'IA Generativa di creare e gestire codice, sono costantemente aggiornato su <b>Claude Code</b> e <b>Gemini CLI</b> per guidare il team nella creazione di codice affidabile. Con <b>Cursor</b> e <b>Copilot</b> integrati nelle API, ci sono innumerevoli opportunità per lo sviluppo di soluzioni. La creazione di server <b>MCP</b> aiuta significativamente i componenti di sviluppo del codice a mantenere informazioni aggiornate.
        </>

        :
        <>
          With the advancements in Generative AI's ability to create and maintain code, I'm constantly updated with <b>Claude Code</b> and <b>Gemini CLI</b> to guide the team in creating reliable code. With <b>Cursor</b> and <b>Copilot</b> integrated into APIs, there's plenty of opportunity for solution development. Creating <b>MCP</b> servers significantly helps code development components maintain up-to-date information.
          </>
        
      }
      </p>
    </>

  );
};

export default Summary;
