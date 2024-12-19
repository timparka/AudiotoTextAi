/* TODO 
grab unique urls relating to same video bytes into an array
be able to send those urls to an api

*/
console.log("hello");

interface Headers {
    acceptRanges: string;
    contentType: string;
    contentLength: number;
}

interface NetworkResponseReceivedParams {
    response: {
      url: string;
      status: number;
      mimeType: string;
      headers: Headers;
    };
}
let videoUrls: Set<string> = new Set<string>();
  
  chrome.action.onClicked.addListener(function (tab) {
    if (tab.url?.startsWith('http') && tab.id !== undefined) {
      console.log('Valid tab detected. URL:', tab.url, 'Tab ID:', tab.id);
  
      chrome.debugger.detach({ tabId: tab.id }, function () {
        if (chrome.runtime.lastError) {
          //console.warn('No existing debugger to detach:', chrome.runtime.lastError.message);
        } else {
          //console.log('Existing debugger detached, if any.');
        }
  
        chrome.debugger.attach({ tabId: tab.id }, '1.3', function () {
          if (chrome.runtime.lastError) {
            //console.error('Debugger attach error:', chrome.runtime.lastError.message);
          } else {
            console.log('Debugger successfully attached to tab:', tab.id);
  
            chrome.debugger.sendCommand(
              { tabId: tab.id },
              'Network.enable',
              {},
              function () {
                if (chrome.runtime.lastError) {
                  //console.error('Network.enable error:', chrome.runtime.lastError.message);
                } else {
                  //console.log('Network debugging successfully enabled on tab:', tab.id);
                }
              }
            );
          }
        });
      });
    } else {
      //console.log('Debugger can only be attached to HTTP/HTTPS pages. Tab details:', tab);
    }
  });
  
  chrome.debugger.onEvent.addListener(function (source, method, params) {
    if (method === 'Network.responseReceived') {
      //console.log('Network.responseReceived event detected. Params:', params);
  
      const { response } = params as NetworkResponseReceivedParams;
      if (!response) {
        console.warn('No response object in event params:', params);
        return;
      }
 
      if (response.headers.contentType === "video/mp4") {

      }
      if ( (response.url.startsWith("https://scontent")) && response.url.includes('.mp4')) {
        videoUrls.add(response.url);
        console.log('MP4 file detected:', response.url, response.headers.contentLength, response.headers.contentType, response.headers.acceptRanges);
        console.log(videoUrls);
      } else {
        //console.log('Response is not an MP4 file. URL:', response.url);
      }
    } else {
      //console.log('Unhandled method:', method);
    }
  });
  