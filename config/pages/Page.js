import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { API } from '../constants/api';
// import Modal from '../../src/components/Modal';
import MetaData from './MetaData';
import './Page.scss';

export const makeRequest = (method, url, data) => {
  return new Promise(((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.dataType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = xhr.response;
        resolve(res);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      reject(Error('Network Error'));
    };
    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  }));
}

class Page extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tagKeys: [
        'link[rel="canonical"]',
        'title',
        '[property="og:title"]',
        '[name="description"]',
        '[property="og:description"]',
        '[name="keywords"]',
        '[property="og:type"]',
        '[property="og:image"]',
        '[property="og:image:width"]',
        '[property="og:image:height"]',
        '[name="author"]',
        '[name="owner"]',
        '[property="og:site_name"]',
        '[property="fb:app_id"]',
      ],
      seoReqData: null,
      seoInfo: null,
    }
  }

  calculateSEO = (seoReqData) => {
    const mySeoReqData = seoReqData;
    if (mySeoReqData) {
      const { page, entity, idName } = mySeoReqData;
      if (!page && idName && entity) {
        // this means we need read properties from url
        const id2FindSeo = this.props.match.params[idName];
        mySeoReqData.idValue = id2FindSeo;
      }
      /* makeRequest('POST', `${API.SEO.GET}`, seoReqData).then((myseoInfo) => {
        if (myseoInfo && myseoInfo.data) {
          this.setState({
            seoInfo: myseoInfo.data,
            seoReqData,
          });
        }
      }) */
    }
  }

  removePreviousTag = () => {
    const { tagKeys } = this.state;
    tagKeys.forEach((tag) => {
      try {
        document.querySelector(tag).remove()
      } catch (err) { /* */ }
    })
  }

  componentDidMount = () => {
    this.removePreviousTag();
    const { seoReqData } = this.props;
    const cmp1 = JSON.stringify(seoReqData) !== JSON.stringify(this.state.seoReqData);
    if (cmp1) {
      // this.calculateSEO(seoReqData);
    }
  }

  render() {
    const { ComponentPage } = this.props;
    const { seoInfo, seoReqData } = this.state;
    return (
      <Fragment>
        {seoInfo && seoReqData && (<MetaData seoInfo={seoInfo} />)}
        {ComponentPage && (ComponentPage)}
      </Fragment>
    )
  }
}

Page.propTypes = {
  ComponentPage: PropTypes.node.isRequired,
}

export default Page;
