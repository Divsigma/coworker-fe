export const KEY_RTSS = "rtss"
export const KEY_QSS = "qss"

export const QSS_INFO_KEY_QID = "query_id"
export const QSS_INFO_KEY_TID = "task_id"
export const QSS_INFO_KEY_FPS = "fps"
export const QSS_INFO_KEY_RESOL = "resol"
export const QSS_INFO_KEY_SERVMAP = "serv_map"
export const QSS_INFO_KEY_RESULT = "task_result"
export const QSS_INFO_KEY_QUERY_CTX = "query_ctx"
export const QSS_SNIFF_KEY_SERV_DELAY = "serv_delay"
export const QSS_SNIFF_KEY_TRANS_DELAY = "trans_delay"
export const QSS_SNIFF_KEY_QUEUE_DELAY = "queue_delay"
export const QSS_SNIFF_KEY_OBJ_COUNT = "n_obj"
export const QSS_SNIFF_KEY_TOTAL_DELAY = "tot_delay"

export const RESULT_KEY_ZH = {
    "black": "黑色车",
    "grey": "灰色车",
    "white": "白色车",
    "other": "其他色车",
    "total": "总人数",
    "up": "抬头人数"
}

const static_qss = {
    [QSS_INFO_KEY_QID]: 'ABCD-12',
    [QSS_INFO_KEY_TID]: 'task-id',

    [QSS_INFO_KEY_FPS]: 10,
    [QSS_INFO_KEY_RESOL]: 'DVCHD_720p(4:3)',
    [QSS_INFO_KEY_SERVMAP]: {
        'car_detection_yolov5': 'node1',
        'iic_service': 'node0'
    },

    [QSS_INFO_KEY_RESULT]: {
        'black': 1,
        'grey': 1,
        'white': 2,
        'other': 3
    },

    [QSS_INFO_KEY_QUERY_CTX]: {
        [QSS_SNIFF_KEY_SERV_DELAY]: {
            'car_detection_yolov5': 0.11212,
            'iic_service': 0.5556
        },
        [QSS_SNIFF_KEY_TRANS_DELAY]: {
            'car_detection_yolov5': 0.11212,
            'iic_service': 0.5556
        },
        [QSS_SNIFF_KEY_QUEUE_DELAY]: {
            'car_detection_yolov5': 0.11212,
            'iic_service': 0.5556
        },
        [QSS_SNIFF_KEY_OBJ_COUNT]: 7,
        [QSS_SNIFF_KEY_TOTAL_DELAY]: 0.33636
    }
}

export const RTSS_INFO_KEY_RTSS_ID = "rtss_id"
export const RTSS_INFO_KEY_NID = "node_id"
export const RTSS_INFO_KEY_CPU = "cpu%"
export const RTSS_INFO_KEY_MEM = "mem%"
export const RTSS_INFO_KEY_UPLINK = "uplink(KBps)"
export const RTSS_INFO_KEY_DWLINK = "dwlink(KBps)"
export const RTSS_INFO_KEY_UPBW = "upbw(KBps)"
export const RTSS_INFO_KEY_DWBW = "dwbw(KBps)"

const static_rtss = {
    [RTSS_INFO_KEY_RTSS_ID]: 'node1-1708908682',
    [RTSS_INFO_KEY_NID]: 'node1',
    [RTSS_INFO_KEY_CPU]: 26.45,
    [RTSS_INFO_KEY_MEM]: 62.6,
    [RTSS_INFO_KEY_UPLINK]: 1234,
    [RTSS_INFO_KEY_DWLINK]: 1234,
    [RTSS_INFO_KEY_UPBW]: {
        'node0': 2345
    },
    [RTSS_INFO_KEY_DWBW]: {
        'node0': 5678
    }
}

export const STATIC_RESULT = {
    [KEY_QSS]: {
        'abcd': [static_qss, static_qss, static_qss, static_qss]
    },
    [KEY_RTSS]: {
        'node0': [static_rtss, static_rtss, static_rtss],
        'node1': [static_rtss, static_rtss, static_rtss, static_rtss, static_rtss, static_rtss]
    }
}

export const CTX_RESP_KEY_CTX = "ctx_dict"
export const CTX_KEY_ID = "ctx_id"
export const CTX_KEY_AVG_BIAS = "avg_bias"
export const CTX_KEY_PID_PARAM = "pid_param"

export const CTX_KEY_SIMPLE_DC_LAT_SERIES = "lat_series"
export const CTX_KEY_AIMD_LAT_SERIES = "chunk_avg_tot_delay_series"
export const CTX_KEYS_LIST_LAT_SERIES = [CTX_KEY_SIMPLE_DC_LAT_SERIES, CTX_KEY_AIMD_LAT_SERIES];

export const CTX_KEY_AVG_NOBJ = "avg_nobj"

export const CTX_KEY_AVG_SERV_INPUT_SZ_DICT = "avg_serv_input_sz_dict"
export const CTX_KEY_AVG_EDGE_BW_KBps = "avg_edge_bw_KBps"

const static_sched_ctx = {
    [CTX_KEY_ID]: 's-s-id',
    [CTX_KEY_AVG_BIAS]: [-0.234, -0.034, 0.234],
    
    [CTX_KEY_AIMD_LAT_SERIES]: [0.434, 0.234, 0.434],
    [CTX_KEY_SIMPLE_DC_LAT_SERIES]: [0.434, 0.234, 0.434],
    
    [CTX_KEY_AVG_NOBJ]: 5.14,
    'avg_obj_sz': 511.1,
    'avg_frame_sz': 1515.1,
    [CTX_KEY_AVG_EDGE_BW_KBps]: 51655.55,
    [CTX_KEY_AVG_SERV_INPUT_SZ_DICT]: {
        'car_detection_yolov5': 23.456,
        'iic_service': 1.012
    }
}

export const STATIC_SCHED_CTX = {
    [CTX_RESP_KEY_CTX]: {
        "6XEDL": [static_sched_ctx, static_sched_ctx, static_sched_ctx, static_sched_ctx]
    }
}

export const STATIC_SUBMITED_JOB_DICT = { 
    'JU0Y7': {
        'job_id': 'JU0Y7',
        'selectedIp': 'JU0Y7',
        'type': '测试输出', 
        'selectedVideoId': 'v0', 
        'mode': 'latency',
        'delay_constraint': 0.2,
        'acc_constraint': 0.8
    }
}

const static_appended_result = [
    {
        "count_result": {
            "total": 19,
            "up": 16
        },
        "delay": 0.22060694013323104,
        "execute_flag": true,
        "frame_id": 774,
        "n_loop": 63,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27425,
                "latency": 1.1754405498504639,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 18,
            "up": 15
        },
        "delay": 0.20396453993661062,
        "execute_flag": true,
        "frame_id": 780,
        "n_loop": 64,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27399999999999997,
                "latency": 1.0766024589538574,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 16,
            "up": 12
        },
        "delay": 0.18409783499581472,
        "execute_flag": true,
        "frame_id": 786,
        "n_loop": 65,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27949999999999997,
                "latency": 0.9475843906402588,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 19,
            "up": 16
        },
        "delay": 0.21081665584019255,
        "execute_flag": true,
        "frame_id": 792,
        "n_loop": 66,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27725,
                "latency": 1.1265530586242676,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 17,
            "up": 16
        },
        "delay": 0.21186903544834684,
        "execute_flag": true,
        "frame_id": 798,
        "n_loop": 67,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.26975,
                "latency": 1.1213617324829102,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 19,
            "up": 14
        },
        "delay": 0.21648645401000977,
        "execute_flag": true,
        "frame_id": 804,
        "n_loop": 68,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.273,
                "latency": 1.1257836818695068,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 18,
            "up": 16
        },
        "delay": 0.21124557086399626,
        "execute_flag": true,
        "frame_id": 810,
        "n_loop": 69,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.276,
                "latency": 1.0686159133911133,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 20,
            "up": 15
        },
        "delay": 0.21829724311828613,
        "execute_flag": true,
        "frame_id": 816,
        "n_loop": 70,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.271,
                "latency": 1.180079460144043,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 20,
            "up": 15
        },
        "delay": 0.21993769918169295,
        "execute_flag": true,
        "frame_id": 822,
        "n_loop": 71,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27575,
                "latency": 1.1873185634613037,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 19,
            "up": 15
        },
        "delay": 0.2089878831590925,
        "execute_flag": true,
        "frame_id": 828,
        "n_loop": 72,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27949999999999997,
                "latency": 1.1177542209625244,
                "pid": 11065
            }
        ]
    },
    {
        "count_result": {
            "total": 18,
            "up": 14
        },
        "delay": 0.20454134259905135,
        "execute_flag": true,
        "frame_id": 834,
        "n_loop": 73,
        "proc_resource_info_list": [
            {
                "cpu_util_limit": 1,
                "cpu_util_use": 0.27425,
                "latency": 1.0840375423431396,
                "pid": 11065
            }
        ]
    }
];