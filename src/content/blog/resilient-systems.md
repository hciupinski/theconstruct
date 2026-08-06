---
title: Designing resilient systems
excerpt: Notes on resiliency patterns for modern cloud architectures and critical services.
publishedAt: 2024-05-10
tags:
  - Architecture
  - Resilience
  - Cloud
---

Reliable systems are designed around the assumption that a dependency, network
connection, or deployment will eventually fail. The goal is not to eliminate
every failure, but to make failure contained, observable, and recoverable.

## Start with clear boundaries

Define ownership for data, retries, timeouts, and recovery at each service
boundary. A request should have a bounded lifetime, and every retry needs a
budget so that an outage does not turn into cascading load.

## Make recovery observable

Record the signals that explain both the request path and the recovery path:

- request latency and error rate;
- queue depth and retry volume;
- the health of critical dependencies.

These signals turn a resilience design from a diagram into an operational
practice.
