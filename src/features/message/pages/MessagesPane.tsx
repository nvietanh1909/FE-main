import * as React from 'react';
import { Box, Paper, Stack } from '@mui/material';
import AvatarWithStatus from '../AvatarWithStatus.tsx';
import ChatBubble from '../ChatBubbleSimple.tsx';
import MessageInput from './MessageInputSimple.tsx';
import MessagesPaneHeader from '../MessagePaneHeaderSimple.tsx';
import { ChatProps, MessageProps } from '../types.js';

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = React.useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  React.useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  return (
    <Box
      sx={{
        height: { xs: 'calc(100vh - 64px)', md: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      <MessagesPaneHeader sender={chat.sender} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender.username === 'user';
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
              >
                {message.sender.username !== 'user' && (
                  <AvatarWithStatus
                    online={message.sender.online}
                    src={message.sender.avatar}
                    alt={message.sender.name}
                  />
                )}
                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          const newId = chatMessages.length + 1;
          const newIdString = newId.toString();
          setChatMessages([
            ...chatMessages,
            {
              id: newIdString,
              sender: {
                name: 'Bạn',
                username: 'user',
                online: true
              },
              content: textAreaValue,
              timestamp: 'Just now',
            },
          ]);
        }}
      />
    </Box>
  );
}