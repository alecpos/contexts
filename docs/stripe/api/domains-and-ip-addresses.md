# Domains and IP addresses

Ensure your integration is always communicating with Stripe.

You can subscribe to the [API announce mailing list](https://groups.google.com/a/lists.stripe.com/g/api-announce) to be notified of any changes to our IP addresses. We provide seven days’ notice through that mailing list before making changes.

Your integration must be able to reach any of Stripe’s fully qualified [domain names](#stripe-domains) for it to function properly. Depending on how your integration operates, you may need add them to an allowlist.

To help your integration operate securely, it must also verify that it’s communicating with **api.stripe.com** through one of our listed [IP addresses](#ip-addresses).

If your integration also receives [webhooks](https://docs.stripe.com/webhooks.md) from us, make sure these events originate from a Stripe [webhook IP address](#webhook-notifications).

## Stripe domains

Stripe uses the following fully qualified domain names to interact with your integration:

```missinglanguage
a.stripecdn.com
api.stripe.com
atlas.stripe.com
auth.stripe.com
b.stripecdn.com
billing.stripe.com
buy.stripe.com
c.stripecdn.com
checkout.stripe.com
climate.stripe.com
connect.stripe.com
dashboard.stripe.com
express.stripe.com
f.stripecdn.com
files.stripe.com
hcaptcha.com
hooks.stripe.com
invoice.stripe.com
invoicedata.stripe.com
js.stripe.com
m.stripe.com
m.stripe.network
manage.stripe.com
merchant-ui-api.stripe.com
pay.stripe.com
payments.stripe.com
q.stripe.com
qr.stripe.com
r.stripe.com
stripe.com
terminal.stripe.com
uploads.stripe.com
verify.stripe.com
```

## Stripe Terminal domains

If you use [Stripe Terminal](https://docs.stripe.com/terminal.md), Stripe uses the following fully qualified domain names to interact with your integration:

```missinglanguage
api.emms.bbpos.com
armada.stripe.com
gator.stripe.com
stripe-point-of-sale-us-west-2.s3.us-west-2.amazonaws.com
*.terminal-events.stripe.com
```

Stripe Terminal uses the following fully qualified domain names to sync the device date over NTP:

```missinglanguage
time.android.com
time.cloudflare.com
2.android.pool.ntp.org
```

Stripe Terminal uses the following partially qualified domain name to interact with your integration:

```missinglanguage
\*.[random-string].device.stripe-terminal-local-reader.net
```

## IP addresses

The full list of IP addresses that **api.stripe.com** may resolve to is:

```missinglanguage
13.112.224.240
13.115.13.148
13.210.129.177
13.210.176.167
13.228.126.182
13.228.224.121
13.230.11.13
13.230.90.110
13.55.153.188
13.55.5.15
13.56.126.253
13.56.173.200
13.56.173.232
13.57.108.134
13.57.155.157
13.57.156.206
13.57.157.116
13.57.90.254
13.57.98.27
18.194.147.12
18.195.120.229
18.195.125.165
34.200.27.109
34.200.47.89
34.202.153.183
34.204.109.15
34.213.149.138
34.214.229.69
34.223.201.215
34.237.201.68
34.237.253.141
34.238.187.115
34.239.14.72
34.240.123.193
34.241.202.139
34.241.54.72
34.241.59.225
34.250.29.31
34.250.89.120
35.156.131.6
35.156.194.238
35.157.227.67
35.158.254.198
35.163.82.19
35.164.105.206
35.164.124.216
50.16.2.231
50.18.212.157
50.18.212.223
50.18.219.232
52.1.23.197
52.196.53.105
52.196.95.231
52.204.6.233
52.205.132.193
52.211.198.11
52.212.99.37
52.213.35.125
52.22.83.139
52.220.44.249
52.25.214.31
52.26.11.205
52.26.132.102
52.26.14.11
52.36.167.221
52.53.133.6
52.54.150.82
52.57.221.37
52.59.173.230
52.62.14.35
52.62.203.73
52.63.106.9
52.63.119.77
52.65.161.237
52.73.161.98
52.74.114.251
52.74.98.83
52.76.14.176
52.76.156.251
52.76.174.156
52.77.80.43
52.8.19.58
52.8.8.189
54.149.153.72
54.152.36.104
54.183.95.195
54.187.182.230
54.187.199.38
54.187.208.163
54.238.140.239
54.65.115.204
54.65.97.98
54.67.48.128
54.67.52.245
54.68.165.206
54.68.183.151
107.23.48.182
107.23.48.232
198.137.150.21
198.137.150.22
198.137.150.23
198.137.150.24
198.137.150.25
198.137.150.26
198.137.150.27
198.137.150.28
198.137.150.101
198.137.150.102
198.137.150.103
198.137.150.104
198.137.150.105
198.137.150.106
198.137.150.107
198.137.150.108
198.137.150.171
198.137.150.172
198.137.150.173
198.137.150.174
198.137.150.175
198.137.150.176
198.137.150.177
198.137.150.178
198.137.150.221
198.137.150.222
198.137.150.223
198.137.150.224
198.137.150.225
198.137.150.226
198.137.150.227
198.137.150.228
198.202.176.21
198.202.176.22
198.202.176.23
198.202.176.24
198.202.176.25
198.202.176.26
198.202.176.27
198.202.176.28
198.202.176.101
198.202.176.102
198.202.176.103
198.202.176.104
198.202.176.105
198.202.176.106
198.202.176.107
198.202.176.108
198.202.176.171
198.202.176.172
198.202.176.173
198.202.176.174
198.202.176.175
198.202.176.176
198.202.176.177
198.202.176.178
198.202.176.221
198.202.176.222
198.202.176.223
198.202.176.224
198.202.176.225
198.202.176.226
198.202.176.227
198.202.176.228
```

The full list of IP addresses that **files.stripe.com**, **armada.stripe.com**, and **gator.stripe.com** may resolve to is:

```missinglanguage
3.94.14.82
3.104.99.60
3.114.81.222
3.114.158.108
3.224.33.77
13.113.237.213
13.115.27.220
13.228.40.76
13.236.164.101
18.136.179.41
18.138.166.37
18.141.119.41
18.180.10.245
23.22.133.111
34.233.255.214
34.247.101.32
35.72.84.177
44.235.152.108
44.236.89.158
44.240.26.72
50.19.26.15
52.64.98.19
52.64.208.186
52.210.46.219
54.66.89.9
54.151.226.211
54.163.195.10
54.169.250.228
54.170.183.1
54.187.175.68
54.191.201.88
54.194.97.239
54.203.175.79
54.206.239.65
54.228.85.11
176.34.78.115
198.137.150.0/24
198.202.176.0/24
```

Always use the **api.stripe.com** DNS name to contact our API—never an IP address.

## Webhook notifications

The full list of IP addresses that webhook notifications may come from is:

```missinglanguage
3.18.12.63
3.130.192.231
13.235.14.237
13.235.122.149
18.211.135.69
35.154.171.200
52.15.183.38
54.88.130.119
54.88.130.237
54.187.174.169
54.187.205.235
54.187.216.72
```

## Downloading IP address lists

As a convenience, these IP lists are available in other formats for import into `iptables` or similar tools:

* [https://stripe.com/files/ips/ips_api.txt](https://stripe.com/files/ips/ips_api.txt)
* [https://stripe.com/files/ips/ips_api.json](https://stripe.com/files/ips/ips_api.json)
* [https://stripe.com/files/ips/ips_armada_gator.txt](https://stripe.com/files/ips/ips_armada_gator.txt)
* [https://stripe.com/files/ips/ips_armada_gator.json](https://stripe.com/files/ips/ips_armada_gator.json)
* [https://stripe.com/files/ips/ips_webhooks.txt](https://stripe.com/files/ips/ips_webhooks.txt)
* [https://stripe.com/files/ips/ips_webhooks.json](https://stripe.com/files/ips/ips_webhooks.json)