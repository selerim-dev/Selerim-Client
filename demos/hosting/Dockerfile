FROM python:3.12-slim
WORKDIR /app
COPY demos /app/demos
RUN pip install --no-cache-dir pypdf==6.18.0 gunicorn==23.0.0 \
 && python -m demos.logistics.selerim_demo.generate --output /fixtures/logistics \
 && python -m demos.legal.legal_demo.generate --output /fixtures/legal \
 && useradd --uid 10001 --create-home demo \
 && mkdir -p /data && chown demo:demo /data \
 && chmod -R a-w /fixtures
USER demo
ENV DEMO_STATE_DIR=/data
EXPOSE 8080
CMD ["gunicorn","--bind","0.0.0.0:8080","--workers","2","--threads","2","--timeout","90","demos.hosting.app:create_app()"]
