import { IotData, PublishParams } from 'aws-greengrass-core-sdk';
import { ClientException, ConnectFailedException, EventType, ExportDefinition, ExportFormat, HTTPConfig, InvalidRequestException, IoTAnalyticsConfig, IoTSiteWiseConfig, KinesisConfig, Message, MessageStoreReadErrorException, MessageStreamDefinition, MessageStreamInfo, NotEnoughMessagesException, Persistence, ReadMessagesOptions, RequestPayloadTooLargeException, ResourceNotFoundException, ResponsePayloadTooLargeException, S3ExportTaskDefinition, S3ExportTaskExecutorConfig, ServerOutOfMemoryException, ServerTimeoutException, Status, StatusConfig, StatusContext, StatusLevel, StatusMessage, StrategyOnFull, StreamManagerClient, StreamManagerException, UnauthorizedException, UnknownFailureException, UnknownOperationException, UpdateFailedException, UpdateNotAllowedException, ValidationException } from './stream-manager';
import { deserializeJsonBytesToObj, validateAndSerializeToJsonBytes } from './stream-manager/util';

const client = new IotData();

client.publish(
    {
        topic: 'foo',
        payload: 'bar',
        queueFullPolicy: 'BestEffort',
    },
    (error, data) => {
        if (error) {
            console.log(error);
        }
        if (data) {
            console.log(data.payload);
        }
    },
);

/** BEGIN STREAM MANAGER **/
// Exceptions
const errors: Error[] = [
    new StreamManagerException(),
    new ClientException(),
    new ConnectFailedException(),
    new InvalidRequestException(),
    new MessageStoreReadErrorException(),
    new NotEnoughMessagesException(),
    new RequestPayloadTooLargeException(),
    new ResourceNotFoundException(),
    new ResponsePayloadTooLargeException(),
    new ServerOutOfMemoryException(),
    new ServerTimeoutException(),
    new UnauthorizedException(),
    new UnknownFailureException(),
    new UpdateFailedException(),
    new UnknownOperationException(),
    new UpdateNotAllowedException(),
    new ValidationException(),
];

errors.forEach(console.log);

// Util
const bytes = validateAndSerializeToJsonBytes({ foo: "bar" });
const deserialized = deserializeJsonBytesToObj(bytes, EventType);
deserialized.asMap();

// Client
// All properties defined
let smClient = new StreamManagerClient({
    port: 123,
    host: "hostname",
    onConnectCb: () => {
        return true;
    },
    onErrorCb: (err: Error) => {
        return err;
    },
    logger: {
        error: () => undefined,
        warn: () => undefined,
        info: () => undefined,
        debug: () => undefined,
    },
});

// All properties undefined
smClient = new StreamManagerClient({});

const sequenceNumber: Promise<number> = smClient.appendMessage("streamName", Buffer.from("hello"));
const streamDefinition = new MessageStreamDefinition();
streamDefinition
    .withName("name")
    .withMaxSize(123)
    .withFlushOnWrite(true)
    .withPersistence(Persistence.File)
    .withStrategyOnFull(StrategyOnFull.OverwriteOldestData)
    .withStreamSegmentSize(123)
    .withTimeToLiveMillis(123)
    .withExportDefinition(new ExportDefinition()
        .withHttp([
            new HTTPConfig()
                .withBatchIntervalMillis(123)
                .withBatchSize(10)
                .withDisabled(false)
                .withExportFormat(ExportFormat.RAW_NOT_BATCHED)
                .withIdentifier("id")
                .withPriority(0)
                .withStartSequenceNumber(0)
                .withUri("uri")
        ])
        .withIotAnalytics([
            new IoTAnalyticsConfig()
                .withBatchIntervalMillis(123)
                .withBatchSize(10)
                .withDisabled(true)
                .withIdentifier("id")
                .withIotChannel("channel")
                .withIotMsgIdPrefix("prefix")
                .withPriority(0)
                .withStartSequenceNumber(0)
        ])
        .withIotSitewise([
            new IoTSiteWiseConfig()
                .withBatchIntervalMillis(123)
                .withBatchSize(100)
                .withDisabled(true)
                .withIdentifier("id")
                .withPriority(0)
                .withStartSequenceNumber(0)
        ])
        .withKinesis([
            new KinesisConfig()
                .withBatchIntervalMillis(123)
                .withBatchSize(10)
                .withDisabled(true)
                .withIdentifier("id")
                .withKinesisStreamName("stream-name")
                .withPriority(0)
                .withStartSequenceNumber(0)
        ])
        .withS3TaskExecutor([
            new S3ExportTaskExecutorConfig()
                .withDisabled(true)
                .withIdentifier("id")
                .withPriority(0)
                .withSizeThresholdForMultipartUploadBytes(100)
                .withStatusConfig(
                    new StatusConfig()
                        .withStatusLevel(StatusLevel.ERROR)
                        .withStatusStreamName("status-stream")
                )
        ])
    );
const createStreamResult: Promise<void> = smClient.createMessageStream(streamDefinition);
const updateStreamResult: Promise<void> = smClient.updateMessageStream(streamDefinition);
const deleteStreamResult: Promise<void> = smClient.deleteMessageStream("stream-name");
const readMessagesResult: Promise<Message[]> = smClient.readMessages(
    "stream-name",
    new ReadMessagesOptions()
        .withDesiredStartSequenceNumber(0)
        .withMaxMessageCount(10)
        .withMinMessageCount(10)
        .withReadTimeoutMillis(1000)
);
const listStreamsResult: Promise<string[]> = smClient.listStreams();
const describeMessageStreamResult: Promise<MessageStreamInfo> = smClient.describeMessageStream("stream-name");
smClient.onConnected(() => undefined);
smClient.onError(() => undefined);
smClient.close();

// Data
Status.Success;
Status.Failure;
Status.InProgress;
Status.Warning;
Status.Canceled;

StatusLevel.ERROR;
StatusLevel.WARN;
StatusLevel.INFO;
StatusLevel.DEBUG;
StatusLevel.TRACE;

const s3ExportTaskDefinition = new S3ExportTaskDefinition()
    .withBucket("bucket")
    .withInputUrl("input")
    .withKey("key")
    .withUserMetadata({
        key: "value",
    });

new Message()
    .withIngestTime(123)
    .withPayload(Buffer.from("payload"))
    .withSequenceNumber(0)
    .withStreamName("name");

const statusContext = new StatusContext()
    .withExportIdentifier("id")
    .withS3ExportTaskDefinition(s3ExportTaskDefinition)
    .withSequenceNumber(0)
    .withStreamName("stream-name");

new StatusMessage()
    .withEventType(EventType.S3Task)
    .withMessage("message")
    .withStatus(Status.Canceled)
    .withStatusContext(statusContext)
    .withStatusLevel(StatusLevel.WARN)
    .withTimestampEpochMs(123);

StrategyOnFull.OverwriteOldestData;
StrategyOnFull.RejectNewData;

Persistence.File;
Persistence.Memory;

ExportFormat.JSON_BATCHED;
ExportFormat.RAW_NOT_BATCHED;
/** END STREAM MANAGER */
