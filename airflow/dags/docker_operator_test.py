from __future__ import annotations

import pendulum

from airflow.models.dag import DAG
from airflow.providers.docker.operators.docker import DockerOperator

with DAG(
    dag_id="docker_operator_test",
    start_date=pendulum.datetime(2025, 7, 17, tz="UTC"),
    catchup=False,
    schedule="*/1 * * * *",
    tags=["docker", "test"],
) as dag:
    DockerOperator(
        task_id="docker_test",
        image="ubuntu:latest",
        command='bash -c "for i in {1..10}; do echo $i; sleep 1; done"',
        auto_remove="never",
        network_mode="bridge",
        labels={
            "logger": "vector",
            "service_name": "docker_test",
            "service_namespace": "common_services",
        },
    )
