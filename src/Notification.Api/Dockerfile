FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY ["src/Notification.Api/Notification.Api.csproj", "src/Notification.Api/"]
COPY ["src/Shared.Contracts/Shared.Contracts.csproj", "src/Shared.Contracts/"]

RUN dotnet restore "src/Notification.Api/Notification.Api.csproj"

COPY . .

WORKDIR /src/src/Notification.Api

RUN dotnet publish "Notification.Api.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet","Notification.Api.dll"]