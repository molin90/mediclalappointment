import React from 'react';
import { Helmet } from 'react-helmet';
import { BASE_WEBSITE_URL, TAB_WEB_NAME } from '../constants/constants'

const MetaData = ({ seoInfo }) => {
  const { seotitle, seodescription, seokeywords } = seoInfo;
  const pathname = (document && document.location && document.location.pathname) ? document.location.pathname : '';
  return (
    <Helmet>
      {seotitle && (
        <title>{`${seotitle} - ${TAB_WEB_NAME}`}</title>
      )}
      {seotitle && (
        <meta property="og:title" content={`${seotitle} - ${TAB_WEB_NAME}`} />
      )}
      {seodescription && (
        <meta name="description" content={`${seodescription}`} />
      )}
      {seodescription && (
        <meta name="og:description" content={`${seodescription}`} />
      )}
      {seokeywords && <meta name="keywords" content={`${seokeywords}`} />}
      <link rel="canonical" href={BASE_WEBSITE_URL} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="http://www.mediclalappointment.com/images/FB.jpg" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />
      <meta name="author" content={`${TAB_WEB_NAME}`} />
      <meta name="owner" content={`${TAB_WEB_NAME}`} />
      <meta property="og:site_name" content={`${TAB_WEB_NAME}`} />
      <meta property="og:url" content={`${TAB_WEB_NAME}${pathname}`} />
      <meta property="fb:app_id" content="589826701130819" />
    </Helmet>
  )
}

export default MetaData;
