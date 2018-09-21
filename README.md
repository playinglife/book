# README

## Using doorkeeper

* access grant

```curl
curl -F grant_type=authorization_code \
 -F client_id=4731a4a241c1a1b0f56adbc8f9b37b3e9824fb57610b395a6f3c11e88ad7e13f \
 -F client_secret=4c7ee8f006ba18eac53e2411510ccf923ca12a3fea1d1b784ce0fcbf20e16115 \
 -F code=ace1d79894c673b59e6fffd15633c07d1d25ace85cfe98830b34808b9950d366 \
 -F redirect_uri=urn:ietf:wg:oauth:2.0:oob \
 -X POST http://localhost:3000/oauth/token
 ```

 * make requests with given token
