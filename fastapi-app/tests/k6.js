import http from 'k6/http'
import { check, group, sleep } from 'k6'

export const options = {
    tags: {
        testid: 'fast-api',
    },
    stages: [
        { duration: '1m', target: 10 },
        { duration: '1m', target: 20 },
        { duration: '1m', target: 0 },
    ],
    thresholds: { http_req_duration: ['avg<100', 'p(95)<200'] },
    noConnectionReuse: true,
}

export default function () {
    const res = http.get(
        `http://${__ENV.API_URL}/api/v1/user?name=test&email=test@test.com&password=password`
    )
    check(res, {
        'is status 200': (res) => res.status === 200,
        'res is correct': (res) =>
            res.body === JSON.stringify({ status: 200, success: true, message: 'login success' }),
    })
}
