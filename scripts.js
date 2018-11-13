// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  function init() {
    const input = document.querySelector('form');
    input.addEventListener('submit', search);/* eslint-disable-line*/

    function clearData(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    }
    function displayError(oops) {
      const container = document.querySelector('div');
      clearData(container);
      const er = document.createTextNode(oops);
      container.appendChild(er);
    }

    function showDataHelp(dtValue, ddValue, dl) {
      const dtn = document.createElement('dt');
      dtn.appendChild(document.createTextNode(dtValue));
      dl.appendChild(dtn);
      const ddn = document.createElement('dd');
      ddn.appendChild(document.createTextNode(ddValue));
      dl.appendChild(ddn);

      const container = document.querySelector('div');
      container.appendChild(dl);
    }

    function showData(dataList) {
      const container = document.querySelector('div');
      clearData(container);

      const [{
        domain, registered, lastChange, expires,
      }] = dataList;
      const dl = document.createElement('dl');

      showDataHelp('domain', domain, dl);
      showDataHelp('registered', registered, dl);
      showDataHelp('lastChange', lastChange, dl);
      showDataHelp('expires', expires, dl);

      try {
        const [{
          registrantname, email, address, country,
        }] = dataList;
        showDataHelp('registrantname', registrantname, dl);
        showDataHelp('email', email, dl);
        showDataHelp('address', address, dl);
        showDataHelp('country', country, dl);
      } catch (err) {
        // do nothing
      }
    }

    function disLoad() { /*eslint-disable-line*/
      const container = document.querySelector('div');
      clearData(container);
      const loading = document.createTextNode('Leita að léni...');
      container.appendChild(loading);
      loading.className = 'loading';
      const img = document.createElement('img');
      img.src = 'loading.gif';
      img.className = 'loading';
      container.appendChild(img);
    }

    function getData(newurl) { /*eslint-disable-line*/
      const r = new XMLHttpRequest();

      r.open('GET', newurl, true);

      r.onload = () => {
        let error = false;
        let data;

        if (r.status >= 200 && r.status < 400) {
          try {
            data = JSON.parse(r.response);
          } catch (e) {
            error = true;
            displayError('Villa við að sækja gögn');
          }
        } else {
          error = true;
        }
        if (error) {
          displayError('Villa við að sækja gögn');
        } else {
          showData(data.results);
        }
      };
      r.onerror = () => {
        displayError('Villa við að sækja gögn');
      };
      r.send();
    }
  }

  function search(e) {
    e.preventDefault();
    disLoad();/*eslint-disable-line*/
    if (e.target.querySelector('input').value.length > 0) {
      const newurl = API_URL + e.target.querySelector('input').value;
      if (newurl !== API_URL) {
        getData(newurl);/*eslint-disable-line*/
      }
    } else {
      displayError('Lén verður að vera strengur');/*eslint-disable-line*/
    }
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.getElementsByClassName('domains');
  program.init(domains);
});
