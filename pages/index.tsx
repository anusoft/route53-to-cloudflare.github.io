import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'

import React, { useState } from 'react';

export default function Home() {

  const [errorMessage, setErrorMessage] = useState('');


  function download(filename : string, text : string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (!event.target.files || event.target.files?.length === 0) {
      setErrorMessage('No file selected');
      return;
    }

    let firstFile = event.target.files[0];

    reader.readAsText(firstFile);
    
    reader.onload = function(e) {

      // something broken
      if (reader.result === null) {
        setErrorMessage('Unable to read file');
        return;
      }

      let csvData = reader.result.toString().split('\n');
      if (csvData.length < 2) {
        setErrorMessage('No record in CSV File');
        return;
      }

      let headers = csvData[0].split(',');


      if (headers.length < 3){
        setErrorMessage('Invalid CSV file');
        return;
      }


      let resultBindTXT = '';
      let records = 0;


      // dkim-dns-records >>> Type,Name,Value
      // DNS_Configuration >>> Domain Name,Record Name,Record Type,Record Value

      for (let i=1; i < csvData.length; i++) {
        let domainName, rowType , rowName, rowValue;
        if (headers.length == 3) {
          [rowType , rowName, rowValue] = csvData[i].split(',');
        } else {
          [domainName, rowName, rowType , rowValue] = csvData[i].split(',');

        }

        if (rowType !== 'A' && rowType !== 'CNAME') {
          setErrorMessage('Invalid CSV file');
          continue;
        }

        resultBindTXT += `${rowName} IN ${rowType} ${rowValue};\n`
        records++;

      }

      if (records === 0) {
        setErrorMessage('No usage record in CSV');
        return;
      }

      let fileName = `cloudflare-bind-${new Date().toJSON().slice(0,10)}.txt`
      setErrorMessage(`Saved ${fileName} file to machine`);
      download(fileName,resultBindTXT);

    }

  };

  return (
    <>
      <Head>
        <title>Route53 to CloudFlare</title>
        <meta name="description" content="Convert AWS Route53 (csv) to Cloudflare" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        Convert AWS Route53 (csv) to CloudFlare Importable format (BIND)

      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={changeHandler}
        style={{ display: "block", margin: "10px auto" }}
      />

      {errorMessage && (
        <p className="error"> {errorMessage} </p>
      )}

      </main>
    </>
  )
}
